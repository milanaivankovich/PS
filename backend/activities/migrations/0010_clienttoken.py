# Generated by Django 5.1.3 on 2025-01-09 11:26

import django.db.models.deletion
import django.utils.crypto
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0009_activities_registered_users'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ClientToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default=django.utils.crypto.get_random_string, max_length=40, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('client', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='client_auth_token', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
