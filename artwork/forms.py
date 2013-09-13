from django import forms
from models import Country
from django.forms.formsets import BaseFormSet


class ArtForm(forms.Form):
    name = forms.CharField()
    country = forms.ModelChoiceField(queryset = Country.objects.all())
    
class ArtDeliverForm(forms.Form):
    country = forms.ModelChoiceField(queryset = Country.objects.all())
    price = forms.DecimalField()
    
class RequiredFormSet(BaseFormSet):
    def __init__(self, *args, **kwargs):
        super(RequiredFormSet, self).__init__(*args, **kwargs)
        for form in self.forms:
            form.empty_permitted = False
    