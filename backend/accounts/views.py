from rest_framework import viewsets
from .models import  BusinessSubject, Client
from .serializers import  BusinessSubjectSerializer, ClientSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from accounts.authentication import custom_authenticate
from accounts.authentication import custom_authenticate_bs

from django.utils.crypto import get_random_string
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework.permissions import AllowAny
from .models import ClientToken
from .models import BusinessSubjectToken
import logging


from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view,  authentication_classes, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import authenticate

from rest_framework import status
from django.db.models import Q
from django.contrib.auth import get_user_model




class BusinessSubjectViewSet(viewsets.ModelViewSet):
    queryset = BusinessSubject.objects.all()
    serializer_class = BusinessSubjectSerializer
    permission_classes = [IsAuthenticated]

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(["PUT"])
def edit_client(request, pk):
    # Retrieve the token from the Authorization header
    token = request.headers.get('Authorization')  # Format: "Token <your_token>"
    
    if not token:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        # Extract the actual token key from the "Token <token>" format
        token_key = token.split(' ')[1]  # Assumes "Token <token>"
        
        # Retrieve the token object from the database
        client_token = ClientToken.objects.get(key=token_key)
        
        # Retrieve the client associated with this token
        user = client_token.client  # assuming you have a reverse relationship 'client' on your ClientToken model
        
    except ClientToken.DoesNotExist:
        return Response({"error": "Invalid token or token expired"}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Check if the authenticated user is the one trying to edit their profile
    if user.pk != pk:
        return Response({"error": "You can only edit your own profile"}, status=status.HTTP_403_FORBIDDEN)
    
    # Get the old and new passwords from the request data
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if old_password and new_password and confirm_password:
        # Authenticate user with the old password to verify it
        user = custom_authenticate(username=user.username, password=old_password)
        
        if not user:
            return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the new password and confirm password match
        if new_password != confirm_password:
            return Response({"error": "New password and confirmation do not match."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the user's password
        user.set_password(new_password)
        user.save()


        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
    



    try:
        # Fetch the client to be updated
        client = Client.objects.get(pk=pk)

    except Client.DoesNotExist:
        return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

    # Use the serializer to update the client data
    serializer = ClientSerializer(client, data=request.data, partial=True)  # partial=True to allow partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_client(request, pk):
    try:
        user = Client.objects.get(pk=pk)
    except Client.DoesNotExist:
        return Response({"error": "Client not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ClientSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_business_subject(request, pk):
    try:
        user = BusinessSubject.objects.get(pk=pk)
    except BusinessSubject.DoesNotExist:
        return Response({"error": "Business Subject not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = BusinessSubjectSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['PUT'])
def edit_business_subject(request, pk):
    user = BusinessSubject.objects.get(pk=pk)
    serializer = BusinessSubjectSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def register_standard_user(request):
    serializer = StandardUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_business_subject(request):
    serializer = BusinessSubjectSerializer(data=request.data)
    if serializer.is_valid():
        business_profile = serializer.save()

        return Response({
            "profile": BusinessSubjectSerializer(business_profile).data  # Return the user's profile data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_client(request):
    # Deserialize the incoming registration data
    serializer = ClientSerializer(data=request.data)
    
    if serializer.is_valid():
        # Save the user data and create the user profile
        client_profile = serializer.save() 

        return Response({
            "profile": ClientSerializer(client_profile).data  # Return the user's profile data
        }, status=status.HTTP_201_CREATED)
    
    # If the data isn't valid, return an error response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get logger for debugging
logger = logging.getLogger(__name__)

@api_view(["POST"])
def login_business_subject(request):
    try:
        # Get username and password from the request
        email = request.data.get("email")
        password = request.data.get("password")

        # Validate input
        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        # Use the custom authentication function to authenticate the user
        user = custom_authenticate_bs(email, password)

        if not user:
            logger.warning(f"Failed login attempt for email: {email}")
            return Response({"error": "Invalid credentials"}, status=400)

        # Check if the user is active
        if not user.is_active:
            return Response({"error": "Account is disabled"}, status=403)

        # Create or retrieve the token for the user (client or business subject)
        token, created = BusinessSubjectToken.objects.get_or_create(
            business_subject=user,  # Use 'user' here since both Client and BusinessSubject will be handled
            defaults={"key": get_random_string(40)}  # Assign a random token key if it's created
        )

        # Return the token
        return Response({"token": token.key}, status=200)

    except Exception as e:
        logger.error(f"Unexpected error during login for user '{email}': {str(e)}", exc_info=True)
        return Response({"error": "An unexpected error occurred"}, status=500)    







# Get logger for debugging
logger = logging.getLogger(__name__)

@api_view(["POST"])
def login_user(request):
    try:
        # Get username and password from the request
        username = request.data.get("username")
        password = request.data.get("password")

        # Validate input
        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)

        # Use the custom authentication function to authenticate the user
        user = custom_authenticate(username, password)

        if not user:
            logger.warning(f"Failed login attempt for username: {username}")
            return Response({"error": "Invalid credentials"}, status=400)

        # Check if the user is active
        if not user.is_active:
            return Response({"error": "Account is disabled"}, status=403)

        # Create or retrieve the token for the user (client or business subject)
        token, created = ClientToken.objects.get_or_create(
            client=user,  # Use 'user' here since both Client and BusinessSubject will be handled
            defaults={"key": get_random_string(40)}  # Assign a random token key if it's created
        )

        # Return the token
        return Response({"token": token.key}, status=200)

    except Exception as e:
        logger.error(f"Unexpected error during login for user '{username}': {str(e)}", exc_info=True)
        return Response({"error": "An unexpected error occurred"}, status=500)

@api_view(['POST'])
def logout_user(request):
    # Get the token from the request headers
    auth_token = request.auth

    if not auth_token:
        return Response({"error": "No authentication token provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Delete the token, effectively logging the user out
        token = Token.objects.get(key=auth_token)
        token.delete()
        return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@authentication_classes([TokenAuthentication])  # Ensures that the user is authenticated with a token
@permission_classes([IsAuthenticated])  # Ensures that the user is authenticated
def get_profile(request):
    # Get the user object based on the request's user (authenticated user)
    user = request.user

    user_data = {}
    user_type = None

    # Check if the user is a Client
    try:
        client = Client.objects.get(user=user)
        user_type = "Client"
        user_data = ClientSerializer(client).data  # Serialize the client profile data
    except Client.DoesNotExist:
        client = None

    # Check if the user is a Business Subject
    try:
        business_subject = BusinessSubject.objects.get(user=user)
        user_type = "BusinessSubject"
        user_data = BusinessSubjectSerializer(business_subject).data  # Serialize the business subject profile data
    except BusinessSubject.DoesNotExist:
        business_subject = None

    if not (client or business_subject):
        return Response({"error": "No associated user profile found"}, status=status.HTTP_404_NOT_FOUND)

    # Return the profile data for the logged-in user
    return Response({
        'user_id': user.pk,
        'username': user.username,
        'user_type': user_type,
        'user_data': user_data  # The profile data for the logged-in user
    }, status=status.HTTP_200_OK)        



@api_view(['GET'])
@permission_classes([AllowAny])  # Allow all users to access this endpoint
def search_users(request):
    query = request.GET.get('q', '').strip()  # Strip any leading/trailing whitespace
    
    if not query:
        return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Search for clients
    client_results = Client.objects.filter(
        Q(first_name__icontains=query) | 
        Q(last_name__icontains=query) |
        Q(username__icontains=query)  # Assuming you have a 'username' field for Client
    ).distinct()  # Avoid duplicate clients in case of multiple matches

    # Search for business profiles
    business_results = BusinessSubject.objects.filter(
        Q(business_name__icontains=query)
    ).distinct()  # Search businesses by company name

    # Serialize client results
    serialized_clients = []
    for client in client_results:
        client_data = ClientSerializer(client).data
        
        # Remove the 'id' field
        client_data.pop('id', None)
        
        # Add client data to the results
        serialized_clients.append(client_data)

    # Serialize business profile results
    serialized_business_profiles = BusinessSubjectSerializer(business_results, many=True).data
    for business in serialized_business_profiles:
        business.pop('id', None)  # Remove the 'id' field for each business profile

    # Combine results
    result = {
        "clients": serialized_clients,
        "business_profiles": serialized_business_profiles
    }

    return Response(result, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_clients(request):
    """
    List all registered clients. Accessible only to admin users.
    """
    clients = Client.objects.all()
    serializer = ClientSerializer(clients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
