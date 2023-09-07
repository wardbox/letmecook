#!/bin/sh

set -e

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Collect static files..."
python manage.py collectstatic --noinput

echo "Create superuser"
DJANGO_SUPERUSER_PASSWORD=$DJANGO_SUPERUSER_PASSWORD \
DJANGO_SUPERUSER_USERNAME=$DJANGO_SUPERUSER_USERNAME \
DJANGO_SUPERUSER_EMAIL=$DJANGO_SUPERUSER_EMAIL \
python manage.py createsuperuser --noinput

exec "$@"