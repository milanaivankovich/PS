from django.urls import path 
from . import views

urlpatterns = [
    #Field Endpoints
    path('api/fields/', views.getData), #GET all fields
    path('api/field/', views.setData), #POST to create new field
    path('api/field/<str:location>/', views.fields_by_location), #GET fields by location
    path('api/sport/<int:sport_id>/', views.get_sport_name), #GET sport name by sport id
]