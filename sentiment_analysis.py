from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import sys

classifier = joblib.load('sentiment_classifier.pkl')
tfidf_vectorizer = joblib.load('tfidf_vectorizer.pkl')

def predict_sentiment(text):
    text_processed = tfidf_vectorizer.transform([text])
    sentiment = classifier.predict(text_processed)[0]
    return sentiment

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python sentiment_analysis.py <text>")
        sys.exit(1)

    text = sys.argv[1]
    sentiment = predict_sentiment(text)
    print(sentiment)
