from fastapi import FastAPI, UploadFile, File
from typing import List
import tempfile
import os
import nltk
import requests
from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline, T5Tokenizer, T5ForConditionalGeneration
from fuzzywuzzy import fuzz
from pydantic import BaseModel

app = FastAPI()

model_name = '/home/student/Models/Question_answering/deepset-roberta-base-squad2'
nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)

model_checkpoint = '/home/student/Models/Question_answering/consciousAI-question-answering-roberta-base-s-v2'
question_answerer = pipeline("question-answering", model=model_checkpoint)

model_name_new = '/home/student/Models/Question_answering/distilbert-base-uncased-distilled-squad'
question_answerer_new = pipeline("question-answering", model=model_name_new)

model_name_new_1 = '/home/student/Models/Question_answering/distilbert-base-cased-distilled-squad'
question_answerer_new_1 = pipeline("question-answering", model=model_name_new_1)

tokenizer_T5 = T5Tokenizer.from_pretrained("/home/student/Models/Question_answering/google-flan-t5-large")
model_T5 = T5ForConditionalGeneration.from_pretrained("/home/student/Models/Question_answering/google-flan-t5-large", device_map="auto")

class TranslationRequest(BaseModel):
    d: List
    q: str

def find_start_index(passage, answer):
    ratio_threshold = 80  # Adjust the threshold as needed
    matches = [fuzz.partial_ratio(answer.lower(), passage[i:i+len(answer)].lower()) for i in range(len(passage) - len(answer) + 1)]
    best_match_index = matches.index(max(matches))
    
    if max(matches) >= ratio_threshold:
        return best_match_index
    else:
        return -1

def T5_model(passage, question):
    input_text = f"""Give answers to the following questions based on the passage only.
    Passage: {passage}
    Question: {question}"""
    input_ids = tokenizer_T5(input_text, return_tensors="pt").input_ids.to("cuda")

    outputs = model_T5.generate(input_ids)
    answer = tokenizer_T5.decode(outputs[0]).replace('<pad>', '').replace('</s>', '').strip()

    start_index = find_start_index(passage.lower(), answer.lower())
    end_index = start_index + len(answer) - 1

    return {'answer': answer, 'start': start_index, 'end': end_index}

@app.post("/answering_update")
async def answering_update(request_data: TranslationRequest):
    try:
        d = request_data.d
        question = request_data.q
        if d:
            context = d[0]['context']
            if 'questions' not in d[0]:
                d[0]['questions'] = {}

            if question not in d[0]['questions'].keys():
                QA_input = {'question': question, 'context': context}
                res = nlp(QA_input)
                res['model'] = 'roberta-base-squad2'

                res3 = question_answerer_new(question=question, context=context)
                res3['model']='distilbert-base-uncased-distilled-squad'
                res4 = question_answerer_new_1(question=question, context=context)
                res4['model']='distilbert-base-cased-distilled-squad'
                res5 = T5_model(question=question,passage = context)
                res5['model'] = 'Flan-T5-Large-Google'

                sentences = nltk.sent_tokenize(context)
                def answer_sentence_finder(r):
                    answer_sentence = None
                    for sentence in sentences:
                        if r['start'] >= context.index(sentence) and r['end'] <= context.index(sentence) + len(sentence):
                            answer_sentence = sentence
                            break

                    context_length = len(context)
                    if answer_sentence is None or len(answer_sentence) <= context_length / 2 or len(answer_sentence) == context_length:
                        answer_start = max(0, r['start'] - 50) 
                        answer_end = min(context_length, r['end'] + 50)  
                        answer_sentence = context[answer_start:answer_end]
                    r['answer_paragraph']=answer_sentence
                
                answer_sentence_finder(res)
                answer_sentence_finder(res3)
                answer_sentence_finder(res4)
                answer_sentence_finder(res5)
                
                d[0]['questions'][question] = []
                d[0]['questions'][question].append(res)
                d[0]['questions'][question].append(res3)
                d[0]['questions'][question].append(res4)
                d[0]['questions'][question].append(res5)

            else:
                print('question already exists')
            return d
    except Exception as e:
            print(e)

