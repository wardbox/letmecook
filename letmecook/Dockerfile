FROM nullstone/django



COPY requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir
COPY . .
RUN mkdir /static
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]