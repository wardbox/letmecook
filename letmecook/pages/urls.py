from django.urls import path
from . import views

urlpatterns = [
    path("who/", views.who, name="who"),
    path("talk/", views.talk, name="talk"),
]
