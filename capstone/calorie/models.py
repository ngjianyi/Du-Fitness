from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator


class User(AbstractUser):
    daily_calories = models.PositiveBigIntegerField(default=0, validators=[MinValueValidator(1)])

    def serialize(self):
        return {
            "daily_calories": self.daily_calories,
        }

class Food(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)
    quantity = models.CharField(max_length=10)
    calories = models.PositiveBigIntegerField(validators=[MinValueValidator(1)])
    date = models.DateField(auto_now_add=True)

class Calories(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    calories = models.PositiveBigIntegerField(default=0)