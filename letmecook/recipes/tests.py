from django.test import TestCase
from django.urls import reverse
from .models import Recipe, Ingredient, Tag
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile


class RecipeModelTest(TestCase):
    def test_recipe_creation(self):
        user = User.objects.create_user(username="testuser", password="testpass")
        recipe = Recipe.objects.create(
            name="Test Recipe",
            prep_time=30,
            cook_time=60,
            servings=4,
            author=user,
            notes="Test notes",
        )
        self.assertEqual(recipe.name, "Test Recipe")
        self.assertEqual(recipe.prep_time, 30)
        self.assertEqual(recipe.cook_time, 60)
        self.assertEqual(recipe.servings, 4)
        self.assertEqual(recipe.author, user)
        self.assertEqual(recipe.notes, "Test notes")

    def test_recipe_detail_view(self):
        image_file = SimpleUploadedFile(
            name="test_image.jpg", content=b"...", content_type="image/jpeg"
        )
        user = User.objects.create_user(username="testuser", password="testpass")
        recipe = Recipe.objects.create(
            name="Test Recipe",
            prep_time=30,
            cook_time=60,
            servings=4,
            author=user,
            image=image_file,
        )
        url = reverse(
            "recipes:recipe_detail", args=[recipe.pk]
        )  # Update the reverse call
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class IngredientModelTest(TestCase):
    def test_ingredient_creation(self):
        ingredient = Ingredient.objects.create(name="Test Ingredient")
        self.assertEqual(ingredient.name, "Test Ingredient")


class TagModelTest(TestCase):
    def test_tag_creation(self):
        tag = Tag.objects.create(name="Test Tag")
        self.assertEqual(tag.name, "Test Tag")
