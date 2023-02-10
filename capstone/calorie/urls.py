from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile", views.profile, name="profile"),
    path("custom_calories", views.custom_calories, name="custom_calories"),
    path("calculated_calories", views.calculated_calories, name="calculated_calories"),
    path("change_password", views.change_password, name="change_password"),
]