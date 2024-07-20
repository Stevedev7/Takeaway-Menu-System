FROM python:3.9-slim-buster

WORKDIR /api

COPY ./requirements.txt ./

RUN  pip install --upgrade pip && \ 
     pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "python", "main.py" ]