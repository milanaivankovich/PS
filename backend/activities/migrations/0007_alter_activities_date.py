# Generated by Django 5.1.3 on 2025-01-02 07:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0006_activities_sport'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activities',
            name='date',
            field=models.DateTimeField(),
        ),
    ]
