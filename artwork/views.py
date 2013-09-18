# Create your views here.
from models import Country,Art,Delivery
from django.shortcuts import render_to_response
from forms import ArtForm,ArtDeliverForm,RequiredFormSet
from django.forms.formsets import formset_factory
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect

@csrf_exempt
def new_art(request):
    ArtDeliverFormSet = formset_factory(ArtDeliverForm,max_num=1,formset=RequiredFormSet)
    if request.POST:
        art_form = ArtForm(request.POST)
        deliver_form = ArtDeliverFormSet(request.POST)
        if art_form.is_valid() and deliver_form.is_valid():
            art_cleaneddata = art_form.cleaned_data

            art = Art()
            art.name = art_cleaneddata['name']
            art.country = art_cleaneddata['country']
            art.save()

            for frm in deliver_form:
                deliver_form_cleandata = frm.cleaned_data
                delivery = Delivery()
                delivery.country = deliver_form_cleandata['country']
                delivery.art = art
                delivery.price = deliver_form_cleandata['price']
                delivery.save()
            return HttpResponseRedirect('/list')
        else:
            return render_to_response('add_art.html',{'form':art_form,'deliver':deliver_form,'error':1})

    form = ArtForm(initial={'country': Country.objects.get(id=3)})

    deliver_form = ArtDeliverFormSet()
    return render_to_response('add_art.html',{'form':form,'deliver':deliver_form})


def list_art(request):
    arts = Art.objects.all()
    deliver_list = Delivery.objects.all()
    return render_to_response('list_art.html',{'arts':arts,'delivery_list':deliver_list})