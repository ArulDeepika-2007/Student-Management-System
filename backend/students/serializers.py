from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = '__all__'

    def validate_year(self, value):
        if value < 1 or value > 4:
            raise serializers.ValidationError(
                "Year must be between 1 and 4."
            )
        return value

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only digits."
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must contain exactly 10 digits."
            )

        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Name cannot be empty."
            )
        return value

    def validate_register_number(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Register number cannot be empty."
            )
        return value

    def validate_department(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Department cannot be empty."
            )
        return value