# Generated by Django 3.2.5 on 2023-12-30 23:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myaccount', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterModelTable(
            name='customuser',
            table=None,
        ),
    ]
