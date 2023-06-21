from django.contrib import admin
from .models import (
    Recipe,
    Ingredient,
    Measurement,
    RecipeIngredient,
    Tag,
    Instruction,
    PreparationType,
)


class InstructionInline(admin.TabularInline):
    model = Instruction
    extra = 1


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1


class RecipeAdmin(admin.ModelAdmin):
    list_display = ("name", "author", "created_at", "updated_at")
    list_filter = ("author", "tags")
    search_fields = ("name", "author__username", "tags__name")
    fields = (
        "name",
        "prep_time",
        "cook_time",
        "servings",
        "author",
        "notes",
        "tags",
        "image",
        "source_url",
    )
    inlines = [InstructionInline, RecipeIngredientInline]


class IngredientAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class MeasurementAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class PreparationTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class RecipeIngredientAdmin(admin.ModelAdmin):
    list_display = (
        "recipe",
        "ingredient",
        "quantity",
        "measurement",
        "preparation_type",
    )
    search_fields = ("recipe__name", "ingredient__name")


class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Measurement, MeasurementAdmin)
admin.site.register(RecipeIngredient, RecipeIngredientAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Instruction)
admin.site.register(PreparationType, PreparationTypeAdmin)
