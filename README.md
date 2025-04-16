
# Fake Social Media Account Detection

This project uses machine learning and Twitter's public API to analyze social media accounts and predict whether a given Twitter profile is likely **fake** or **genuine**.

## Features

- Predicts if a Twitter account is fake using a trained ensemble model (Random Forest, Gradient Boosting, Logistic Regression).
- Caches Twitter account data in MongoDB to avoid redundant API calls.
- Automatically refreshes cached data if it’s older than 3 hours.
- User-friendly web interface built using Flask and Jinja.
- Robust fallback mechanism with multiple Twitter Bearer Tokens.

## Tech Stack

- **Frontend:** HTML, CSS (via Jinja Templates)
- **Backend:** Flask (Python)
- **Database:** MongoDB (Cloud via Atlas)
- **ML Models:** Scikit-learn (Voting Classifier)
- **API:** Twitter API v2

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Aayushi-4094/FakeSocialMediaAccountDetection.git
cd FakeSocialMediaAccountDetection
```

### 2. Create `.env` File

Inside the root folder, create a `.env` file and add your MongoDB URI and Twitter Bearer Tokens:

```env
MONGO_URI=your_mongodb_connection_string

BEARER_TOKEN_1=your_bearer_token_1
BEARER_TOKEN_2=your_bearer_token_2
BEARER_TOKEN_3=your_bearer_token_3
BEARER_TOKEN_4=your_bearer_token_4
```

> Make sure `.env` is included in `.gitignore` to keep credentials secure.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Add Static Training Data

Make sure the following files exist in the root directory:

- `users.csv` — Contains genuine account data.
- `fusers.csv` — Contains fake account data.

These are used to train the prediction models at startup.

### 5. Run the Flask App

```bash
python app.py
```

Open your browser and visit: `http://127.0.0.1:5000`

---

## How It Works

1. Enter a Twitter username in the UI.
2. App checks if cached data exists in MongoDB.
3. If outdated or missing, it fetches data from the Twitter API.
4. Data is parsed, and key metrics are extracted.
5. The ensemble ML model predicts whether the account is fake.
6. Confidence level and detailed metrics are shown on the result page.

---

## Project Structure

```
FakeSocialMediaAccountDetection/
├── app.py                 # Main application logic
├── .env                   # Environment variables (excluded from Git)
├── requirements.txt       # Dependencies
├── templates/             # HTML templates
├── static/                # Static assets (CSS, JS)
├── users.csv              # Real users dataset
├── fusers.csv             # Fake users dataset
├── .gitignore             # Ignore sensitive files
```

This project is for academic and educational use. Feel free to fork or adapt it with credit.
