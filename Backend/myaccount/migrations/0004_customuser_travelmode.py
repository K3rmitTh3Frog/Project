# Generated by Django 3.2.5 on 2024-01-02 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myaccount', '0003_customuser_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='travelMode',
            field=models.CharField(choices=[('driving', 'Driving'), ('walking', 'Walking'), ('bicycling', 'Bicycling'), ('transit', 'Transit')], default='driving', max_length=10, verbose_name='Travel Mode'),
        ),
    ]
