# Generated by Django 4.2.2 on 2023-06-21 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_remove_ingredient_preparation_type_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='source_url',
            field=models.URLField(blank=True),
        ),
    ]
