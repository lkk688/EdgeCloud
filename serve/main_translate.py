from fastapi import FastAPI
from seamless_communication.models.inference import Translator

app = FastAPI()

# Initialize translator
#translator = Translator()

import torch
import json
from seamless_communication.models.inference import Translator

class SeamlessMT4:

    def __init__(self, device=torch.device("cpu")):
        print("[LOG] HFSeamlessM4T init...")
        self._translator = Translator("seamlessM4T_medium", vocoder_name_or_card="vocoder_36langs", device=device)
          #check supported languages - https://github.com/facebookresearch/seamless_communication/tree/main/scripts/m4t/predict
        self._langs = ['afr', 'amh', 'arb', 'ary', 'arz', 'asm', 'azj', 'bel', 'ben', 'bos', 'bul', 'cat', 'ceb', 'ces', 'ckb', 'cmn', 'cmn_Hant', 'cym',
                    'dan', 'deu', 'ell', 'eng', 'est', 'eus', 'fin', 'fra', 'gaz', 'gle', 'glg', 'guj', 'heb', 'hin', 'hrv', 'hun', 'hye', 'ibo', 'ind', 
                     'isl', 'ita', 'jav', 'jpn', 'kan', 'kat', 'kaz', 'khk', 'khm', 'kir', 'kor', 'lao', 'lit', 'lug', 'luo', 'lvs', 'mai', 'mal',
                     'mar', 'mkd', 'mlt', 'mni', 'mya', 'nld', 'nno', 'nob', 'npi', 'nya', 'ory', 'pan', 'pbt', 'pes', 'pol', 'por', 'ron', 'rus', 'slk',
                     'slv', 'sna', 'snd', 'som', 'spa', 'srp', 'swe', 'swh', 'tam', 'tel', 'tgk', 'tgl', 'tha', 'tur', 'ukr', 'urd', 'uzn', 'vie', 'yor',
                     'yue', 'zsm', 'zul']

        self.language_codes = {'Afrikaans': 'afr', 'Amharic': 'amh', 'Arabic': 'arb', 'Moroccan Arabic': 'ary', 'Egyptian Arabic': 'arz', 'Assamese': 'asm', 'Azerbaijani': 'azj', 'Belarusian': 'bel', 'Bengali': 'ben', 'Bosnian': 'bos', 'Bulgarian': 'bul', 'Catalan': 'cat', 'Cebuano': 'ceb', 'Czech': 'ces', 'Kurdish (Sorani)': 'ckb', 'Chinese (Mandarin)': 'cmn', 'Chinese (Mandarin, Traditional)': 'cmn_Hant', 'Welsh': 'cym', 'Danish': 'dan', 'German': 'deu', 'Greek': 'ell', 'English': 'eng', 'Estonian': 'est', 'Basque': 'eus', 'Finnish': 'fin', 'French': 'fra', 'West Central Oromo': 'gaz', 'Irish': 'gle', 'Galician': 'glg', 'Gujarati': 'guj', 'Hebrew': 'heb', 'Hindi': 'hin', 'Croatian': 'hrv', 'Hungarian': 'hun', 'Armenian': 'hye', 'Igbo': 'ibo', 'Indonesian': 'ind', 'Icelandic': 'isl', 'Italian': 'ita', 'Javanese': 'jav', 'Japanese': 'jpn', 'Kannada': 'kan', 'Georgian': 'kat', 'Kazakh': 'kaz', 'Khakas': 'khk', 'Khmer': 'khm', 'Kyrgyz': 'kir', 'Korean': 'kor', 'Lao': 'lao', 'Lithuanian': 'lit', 'Luganda': 'lug', 'Luo': 'luo', 'Latvian': 'lvs', 'Maithili': 'mai', 'Malayalam': 'mal', 'Marathi': 'mar', 'Macedonian': 'mkd', 'Maltese': 'mlt', 'Manipuri': 'mni', 'Burmese': 'mya', 'Dutch': 'nld', 'Norwegian Nynorsk': 'nno', 'Norwegian Bokmål': 'nob', 'Nepali': 'npi', 'Chichewa': 'nya', 'Odia': 'ory', 'Punjabi': 'pan', 'Chin': 'pbt', 'Western Farsi': 'pes', 'Polish': 'pol', 'Portuguese': 'por', 'Romanian': 'ron', 'Russian': 'rus', 'Slovak': 'slk', 'Slovenian': 'slv', 'Shona': 'sna', 'Sindhi': 'snd', 'Somali': 'som', 'Spanish': 'spa', 'Serbian': 'srp', 'Swedish': 'swe', 'Swahili': 'swh', 'Tamil': 'tam', 'Telugu': 'tel', 'Tajik': 'tgk', 'Tagalog': 'tgl', 'Thai': 'tha', 'Turkish': 'tur', 'Ukrainian': 'ukr', 'Urdu': 'urd', 'Uzbek': 'uzn', 'Vietnamese': 'vie', 'Yoruba': 'yor', 'Cantonese': 'yue', 'Malay': 'zsm', 'Zulu': 'zul'}

    def _translate(self, text, src, tgt):
        src = self.language_codes[src]
        tgt = self.language_codes[tgt]
        result, _, _ = self._translator.predict(text, "t2tt", tgt, src_lang=src)
        return str(result)

    def _isAvailable(self, lang):
        lang = self.language_codes[lang]
        if lang in self._langs:
            return True
        return False
    
    def _split_text(self, text, spe):
        splited = text.split(spe)
        res = []
        cnt = 0
        fixedChunk = ""

        for item in splited:
            if (cnt + len(item) < 1024) :
                cnt += len(item)
                fixedChunk += item + spe
            else:
                res.append(fixedChunk)
                cnt=len(item)
                fixedChunk = item + spe
        return res
    
    def _chunk_paragraph(self, paragraph, max_chunk_length=1024):
        print('chunking')
        tokens = paragraph.split()  # Tokenize the paragraph by whitespace
        chunks = []
        current_chunk = ""

        for token in tokens:
            if len(current_chunk) + len(token) <= max_chunk_length:
                current_chunk += token + " "
            else:
                chunks.append(current_chunk.strip())
                current_chunk = token + " "
#             print('true')

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks


    def translateText(self, text, src, tgt):
#         src = language_codes[src]
#         tgt = language_codes[tgt]
        if self._isAvailable(src) and self._isAvailable(tgt):
            
            if (len(text) <= 1024):
                return self._translate(text, src, tgt)
            else:
                chunks = self._chunk_paragraph(text)
                translated_chunks = []
                for chunk in chunks:
                    translated_text = self._translate(chunk, src, tgt)
                    translated_chunks.append(translated_text)
                return " ".join(translated_chunks)
        else:
            print("[ERROR] check languages..")
            return ""
        
    def translateArticle(self, title, src, tgt):
        try:
            bucket_name = "context_data1"
            file_name = "article_data.json"

            # Initialize Google Cloud Storage client
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(file_name)
            downloaded_data = blob.download_as_text()
            data = json.loads(downloaded_data)
#             print(data)
            # Find the content with the specified title
            content = next((item for item in data if item['title'] == title.lower()), None)
            print('content:',content)
            if content:
                trans_lists = ['title', 'topic', 'questions', 'summary']  # add content
                item = content
                for key in item.keys():
                    print("LOG item.keys()", key)
                    if key in trans_lists:
                        if isinstance(item[key],str) == True:
                            if (len(item[key]) <= 1024):
                                translated_text = self._translate(item[key], src, tgt)
                                item[key] = translated_text
                            else:
                                sep = "\n" if key == 'context' else "."
                                chunks = self._split_text(item[key], sep)
                                translated_chunks = ""
                                for chunk in chunks:
                                    translated_text = self._translate(chunk, src, tgt)
                                    translated_chunks += translated_text
                                item[key] = translated_chunks

                        elif key == 'questions':
                            ques_keys = list(item[key].keys())
                            output = {}
                            for idx_i, ques_key in enumerate(ques_keys):
                                if (len(ques_keys[idx_i]) <= 1024):
                                    translated_ques = self._translate(ques_keys[idx_i], src, tgt)
                                    answers = item['questions'][ques_keys[idx_i]]
                                    for idx_j, ans in enumerate(answers):
                                        translated_ans = self._translate(ans['answer'], src, tgt)
                                        item['questions'][ques_keys[idx_i]][idx_j]['answer'] = str(translated_ans)
                                        translated_ans = self._translate(ans['answer_paragraph'], src, tgt)
                                    item['questions'][ques_keys[idx_i]][idx_j]['answer_paragraph'] = str(translated_ans)
                                output[str(translated_ques)] = list(item['questions'][ques_keys[idx_i]])
                            #replace questions to translated question, because question_text is the key of dictionary
                            item['questions'] = output
                print(item)
                return(item)
        except Exception as e :
            print(e)

    def translateJson(self, json_file, src, tgt):
        with open(json_file, "r") as read_file:
            data = json.load(read_file)
        trans_lists = ['title', 'topic', 'questions', 'context', 'summary']  
        for item in data:
            for key in item.keys():
                print("LOG item.keys()", key)
                if key in trans_lists:
                    if isinstance(item[key],str) == True:
                        if (len(item[key]) <= 1024):
                            translated_text = self._translate(item[key], src, tgt)
                            item[key] = translated_text
                        else:
                            sep = "\n" if key == 'context' else "."
                            chunks = self._split_text(item[key], sep)
                            translated_chunks = ""
                            for chunk in chunks:
                                translated_text = self._translate(chunk, src, tgt)
                                translated_chunks += translated_text
                            item[key] = translated_chunks

                    elif key == 'questions':
                        ques_keys = list(item[key].keys())
                        output = {}
                        for idx_i, ques_key in enumerate(ques_keys):
                            if (len(ques_keys[idx_i]) <= 1024):
                                translated_ques = self._translate(ques_keys[idx_i], src, tgt)
                                answers = item['questions'][ques_keys[idx_i]]
                                for idx_j, ans in enumerate(answers):
                                    translated_ans = self._translate(ans['answer'], src, tgt)
                                    item['questions'][ques_keys[idx_i]][idx_j]['answer'] = str(translated_ans)
                                    translated_ans = self._translate(ans['answer_paragraph'], src, tgt)
                                    item['questions'][ques_keys[idx_i]][idx_j]['answer_paragraph'] = str(translated_ans)
                            output[str(translated_ques)] = list(item['questions'][ques_keys[idx_i]])
                        #replace questions to translated question, because question_text is the key of dictionary
                        item['questions'] = output

from pydantic import BaseModel

class TranslationRequest(BaseModel):
    text: str
    source: str
    target: str

@app.post("/translate")
async def translate_text(request_data: TranslationRequest):
    """
    Endpoint to translate text from source language to target language.
    """
    translator = SeamlessMT4()
    try:
        translation = translator.translateText(text=request_data.text, src=request_data.source, tgt=request_data.target)
        return {"translation": translation}
    except Exception as e:
        return {"error": str(e)}


