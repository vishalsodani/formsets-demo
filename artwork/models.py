from django.db import models

# Create your models here.
class Country(models.Model):
    name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.name

class Art(models.Model):
    country = models.ForeignKey(Country)
    name = models.CharField(max_length=50)

class Delivery(models.Model):
    country = models.ForeignKey(Country)
    art = models.ForeignKey(Art)
    price = models.DecimalField(max_digits=13, decimal_places=2)