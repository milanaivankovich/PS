# myproject/urls.py
from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('accounts.urls')),  # Make sure this line is included
    path('activities/', include('activities.urls')), #aktivnosti = za slucaj da ne bude radilo
    path('fields/', include('fields.urls')),
]
