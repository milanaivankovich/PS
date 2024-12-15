from django.urls import path
from . import views

urlpatterns = [
    #Review Endpoints
    path('api/reviews/', views.getData), #GET all reviews
    path('api/review/', views.setData), #POST to create new review
    path('api/reviews/<int:field>/', views.reviews_by_field), #GET reviews by field
]