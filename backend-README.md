# DrugPredict Flask Backend

## Setup
```bash
pip install -r requirements.txt
```

## Run
```bash
python flask_app.py
```

## Environment Variables
- `FLASK_ENV`: Set to 'production' for production deployment
- `PORT`: Port number (default: 5001)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Deploy to Render.com
1. Connect your GitHub repo
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python flask_app.py`
4. Add environment variables in Render dashboard

## Deploy to Railway
1. Connect GitHub repo
2. Railway auto-detects Python and uses requirements.txt
3. Set start command: `python flask_app.py`
4. Add environment variables in Railway dashboard
