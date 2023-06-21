from django.urls import path
from . import views

app_name = "recipes"
urlpatterns = [
    path("<int:recipe_id>/", views.recipe_detail, name="recipe_detail"),
    path("", views.recipe_list, name="home"),
]
