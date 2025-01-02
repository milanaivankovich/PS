# Generated by Django 5.1.2 on 2025-01-02 22:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_alter_businesssubject_business_name_and_more'),
        ('fields', '0012_alter_field_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='businesssubject',
            name='favorite_fields',
            field=models.ManyToManyField(blank=True, related_name='favorite_business_subjects', to='fields.field'),
        ),
        migrations.AddField(
            model_name='client',
            name='favorite_fields',
            field=models.ManyToManyField(blank=True, related_name='favorite_clients', to='fields.field'),
        ),
    ]
