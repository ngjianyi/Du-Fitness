from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from datetime import date, datetime, timedelta
from .models import User, Food, Calories


def index(request):

    # User is logged in
    if request.user.is_authenticated:

        # Get user's set daily calories
        calories = User.objects.get(pk=request.user.id).daily_calories
        if calories == 0:
            calories = False
        elif calories > 0:
            pass
        
        try:
            today_calories = Calories.objects.get(user=request.user, date=date.today()).calories
        except Calories.DoesNotExist:
            today_calories = 0

        return render(request, "calorie/index.html", {
            "calories": calories,
            "today_calories": today_calories,
        })

    # User is not logged in
    else:
        return render(request, "calorie/index.html")


@login_required(login_url="/login")
def calculated_calories(request):
    if request.method == "POST":

        data = json.loads(request.body)
        name = data["name"]
        quantity = data["quantity"]
        calories = data["calories"]

        # Update Food
        calculated_calories = Food(user=request.user, name=name, quantity=quantity, calories=calories)
        calculated_calories.save()

        # Update Calories
        try:
            today_calories = Calories.objects.get(user=request.user, date=date.today())
            today_calories.calories += int(calories)
            today_calories.save()

        # If user does not have calories logged today
        except Calories.DoesNotExist:
            today_calories = Calories(user=request.user, calories=calories)
            today_calories.save()

        return HttpResponse(status=204)


@login_required(login_url="/login")
def custom_calories(request):
    if request.method == "POST":

        data = json.loads(request.body)
        name = data["name"]
        quantity = data["quantity"]
        calories = data["calories"]

        # Update Food
        custom_calories = Food(user=request.user, name=name, quantity=quantity, calories=calories)
        custom_calories.save()

        # Update Calories
        try:
            today_calories = Calories.objects.get(user=request.user, date=date.today())
            today_calories.calories += int(calories)
            today_calories.save()

        # If user does not have calories logged today
        except Calories.DoesNotExist:
            today_calories = Calories(user=request.user, calories=calories)
            today_calories.save()
        
        return HttpResponse(status=204)


@login_required(login_url="/login")
def profile(request):
    if request.method == "GET":

        # Get user's set daily calories
        calories = User.objects.get(pk=request.user.id).daily_calories
        if calories == 0:
            calories = False
        elif calories > 0:
            pass

        # calories_history = Calories.objects.filter(user=request.user, date__gte=datetime.now()-timedelta(days=7)).values("calories")

        return render(request, "calorie/profile.html", {
            "calories": calories,
        })

    if request.method == "PUT":
        user = User.objects.get(pk=request.user.id)
        data = json.loads(request.body)
        if data.get("daily_calories") is not None:
            user.daily_calories = data["daily_calories"]

        user.save()
        return HttpResponse(status=204)


def change_password(request):
    if request.method == "POST":
        old_password = request.POST["old_password"]
        new_password = request.POST["new_password"]
        new_confirmation = request.POST["new_confirmation"]

        # Ensure password matches confirmation
        if new_password != new_confirmation:
            return render(request, "calorie/change_password.html", {
                "message": "Passwords must match."
            })

        # Check if authentication successful
        user = authenticate(request, username=request.user.username, password=old_password)
        if user is not None:
            
            # Check if new password is the same as old password
            if new_password == old_password:
                return render(request, "calorie/change_password.html", {
                    "message": "New password must be different from current password."
                })
            
            # Set new password
            u = User.objects.get(id=request.user.id)
            u.set_password(new_password)
            u.save()

            # Login user with new password
            user = authenticate(request, username=request.user.username, password=new_password)
            if user is not None:
                login(request, user)

            # Unable to login
            else:
                return render(request, "calorie/change_password.html", {
                    "message": "Error."
                })

            return render(request, "calorie/change_password.html", {
                "message": "Password successfully changed!"
            })

    elif request.method == "GET":
        return render(request, "calorie/change_password.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "calorie/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "calorie/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = None

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "calorie/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "calorie/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "calorie/register.html")