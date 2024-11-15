from django.db import models
from accounts.models import Client

#dodati opciju za teren
class Aktivnost(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='activities', null=True)
    naziv = models.CharField(max_length=255)
    opis = models.TextField(blank=True, null=True)
    #datum_kreiranja = models.DateTimeField(auto_now_add=True)
    datum = models.DateField(null=True)
    vrijeme = models.TimeField(null=True)

    def __str__(self):
        return self.naziv   