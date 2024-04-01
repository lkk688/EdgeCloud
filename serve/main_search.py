from fastapi import FastAPI
app = FastAPI()
from torch import cuda
from langchain.embeddings.huggingface import HuggingFaceEmbeddings

embed_model_id = '/home/student/Models/Semantic_search/krlvi-sentence-t5-base-nlpl-code_search_net'

device = f'cuda:{cuda.current_device()}' if cuda.is_available() else 'cpu'

embed_model = HuggingFaceEmbeddings(
    model_name=embed_model_id,
    #model_kwargs={'device': device},
    #encode_kwargs={'device': device, 'batch_size': 32}
)
from langchain.vectorstores import Pinecone
import pinecone
import ast
pinecone.init(
	api_key='eff29eca-f3bf-4807-8867-8aebf2e56671',
	environment='gcp-starter'
)
index = pinecone.Index('ohanadata')
from pydantic import BaseModel

class SearchRequest(BaseModel):
    t: str

@app.post("/search")
async def translate_text(request_data: SearchRequest):
    """
    Endpoint to perform semantic search.
    """

    try:
        text_field = 'context'  # field in metadata that contains text content

        vectorstore = Pinecone(
            index, embed_model.embed_query, text_field
        )

        output = vectorstore.similarity_search(
            request_data.t,  # the search query
            k=5  # returns top 5 most relevant chunks of text
        )
        return {"search": output}
    except Exception as e:
        return {"error": str(e)}

