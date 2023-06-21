# Generated by Django 4.2.2 on 2023-06-21 07:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_preparationtype_ingredient_preparation_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ingredient',
            name='preparation_type',
        ),
        migrations.AddField(
            model_name='recipeingredient',
            name='preparation_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='recipes.preparationtype'),
        ),
        migrations.AlterField(
            model_name='recipeingredient',
            name='quantity',
            field=models.DecimalField(decimal_places=2, max_digits=6),
        ),
    ]
