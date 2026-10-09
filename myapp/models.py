from django.db import models

# Create your models here.

class PlayerList(models.Model):
    UserName = models.CharField(max_length=50)
    color = models.CharField(max_length=50)

    def __str__ (self):
        return self.UserName