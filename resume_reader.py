from pathlib import Path

def read_resume(path):
    extension = Path(path).suffix.lower()

    if extension == ".txt":
        with open(path, "r", encoding="utf-8") as file:
            return file.read()

    elif extension == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(path)

        text = ""

        for page in reader.pages:
            text += page.extract_text() or ""

        return text

    else:
        raise ValueError("Unsupported file type")