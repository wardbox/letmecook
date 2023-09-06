from django.shortcuts import render


def who(request):
    return render(request, "who.html")


def talk(request):
    return render(request, "talk.html")
