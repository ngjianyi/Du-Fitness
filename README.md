# Du-Fitness
Du Fitness is a calorie calculator and tracker web application built using Django.
Users would have to sign up for an EDAMAM API account to get their APP_ID and APP_KEY.

## Usage
To export APP_ID and APP_KEY as temporary environment variables
```bash
export APP_ID='[EDAMAM_APP_ID]'
```

```bash
export APP_KEY='[EDAMAM_APP_KEY]'
```

```bash
cd capstone
```

To migrate models
```python
python manage.py makemigrations calorie
```

```python
python manage.py migrate
```

To run server
```python
python manage.py runserver
```