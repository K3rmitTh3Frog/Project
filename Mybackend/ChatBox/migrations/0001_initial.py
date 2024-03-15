# Generated by Django 3.2.5 on 2024-03-15 21:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chatbot',
            fields=[
                ('ChatID', models.AutoField(primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('isUser', models.BooleanField(default=False)),
                ('Date', models.DateTimeField(auto_now_add=True)),
                ('UserID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chat', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
