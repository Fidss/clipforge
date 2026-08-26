import sys
import json
from faster_whisper import WhisperModel

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file provided"}))
        sys.exit(1)
        
    audio_path = sys.argv[1]
    model_size = "base" # Adjust depending on need/speed
    
    try:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, beam_size=5, word_timestamps=True)
        
        output_segments = []
        for segment in segments:
            words = [{"word": w.word, "start": w.start, "end": w.end} for w in segment.words]
            output_segments.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text,
                "words": words
            })
            
        print(json.dumps({"segments": output_segments}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
