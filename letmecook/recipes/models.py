from django.db import models
from fractions import Fraction


class Recipe(models.Model):
    name = models.CharField(max_length=255)
    prep_time = models.PositiveIntegerField(default=0, help_text="Time in minutes")
    cook_time = models.PositiveIntegerField(default=0, help_text="Time in minutes")
    servings = models.PositiveIntegerField()
    author = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    tags = models.ManyToManyField("Tag", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to="recipes", blank=True)
    source_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Instruction(models.Model):
    recipe = models.ForeignKey(
        Recipe, related_name="instructions", on_delete=models.CASCADE
    )
    step = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Ingredient(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Measurement(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class PreparationType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="recipe_ingredients"
    )
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=6, decimal_places=2)
    measurement = models.ForeignKey(
        Measurement, on_delete=models.SET_NULL, null=True, blank=True
    )
    preparation_type = models.ForeignKey(
        PreparationType, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"{self.get_fraction()} {self.get_measurement()} {self.ingredient} {self.preparation_type}"

    def get_fraction(self):
        frac = Fraction(float(self.quantity)).limit_denominator()
        if frac.denominator == 1:
            # Whole number
            return str(frac.numerator), None, None
        elif frac.numerator > frac.denominator:
            # Mixed number
            whole_part = frac.numerator // frac.denominator
            frac_part = frac - whole_part
            return str(frac_part.numerator), str(frac_part.denominator), str(whole_part)
        else:
            # Simple fraction
            return str(frac.numerator), str(frac.denominator), None

    def get_measurement(self):
        # if measurement is "Piece" or "Pieces", return empty string
        if self.measurement and self.measurement.name.lower() in ["piece", "pieces"]:
            return ""

        return str(self.measurement).lower() if self.measurement else ""


class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
