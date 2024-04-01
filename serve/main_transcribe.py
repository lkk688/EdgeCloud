from fastapi import FastAPI, UploadFile, File
from typing import List
import tempfile
import os
import whisper
model_whisper = whisper.load_model("medium")
options = dict(language='English', beam_size=5, best_of=5)
transcribe_options = dict(task="transcribe", **options)
translate_options = dict(task="translate", **options)

app = FastAPI()

@app.post("/transcribe_audio_video")
async def transcribe_audio_video(file: UploadFile = File(...)):
    """
    Endpoint to transcribe audio/video from the uploaded file.
    """
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name

        result = model_whisper.transcribe(temp_file_path, **transcribe_options)

        return {"transcribtion": result['text']}
    finally:
        # Clean up the temporary file
        os.unlink(temp_file_path)

