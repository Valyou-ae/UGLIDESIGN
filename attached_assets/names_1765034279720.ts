import { Sex, Ethnicity } from '../../types';

export const NAMES_BY_ETHNICITY_AND_SEX: Record<Sex, Partial<Record<Ethnicity, string[]>>> = {
  'Female': {
    'White': ['Chloe', 'Isabelle', 'Emma', 'Olivia', 'Sophia', 'Ava', 'Mia'],
    'Black': ['Amara', 'Zoe', 'Nia', 'Maya', 'Aaliyah', 'Imani', 'Keisha'],
    'Hispanic': ['Sofia', 'Elena', 'Isabella', 'Valentina', 'Camila', 'Lucia'],
    'Asian': ['Mei', 'Hana', 'Yuki', 'Li Wei', 'Ji-won', 'Sakura'],
    'Indian': ['Priya', 'Anjali', 'Kavya', 'Isha', 'Neha', 'Diya'],
    'Southeast Asian': ['Linh', 'Mai', 'Anh', 'Siti', 'Dara', 'Putri'],
    'Indigenous': ['Kaya', 'Aiyana', 'Nizhoni', 'Chenoa', 'Takoda', 'Aponi'],
    'Diverse': ['Nia', 'Alex', 'Jordan', 'Casey', 'Riley', 'Avery', 'Sage']
  },
  'Male': {
    'White': ['Ethan', 'Noah', 'Liam', 'Mason', 'Lucas', 'James'],
    'Black': ['Jamal', 'Marcus', 'Darius', 'Terrell', 'Isaiah', 'DeShawn'],
    'Hispanic': ['Diego', 'Carlos', 'Miguel', 'Alejandro', 'Luis', 'Fernando'],
    'Asian': ['Kenji', 'Hiro', 'Jin', 'Tao', 'Wei', 'Ryu'],
    'Indian': ['Arjun', 'Rohan', 'Raj', 'Vikram', 'Aditya', 'Karan'],
    'Southeast Asian': ['Nguyen', 'Somchai', 'Dimas', 'Budi', 'Kiet', 'Ahmad'],
    'Indigenous': ['Chayton', 'Kai', 'Ahanu', 'Tahoma', 'Dakota', 'Enapay'],
    'Diverse': ['River', 'Phoenix', 'Sage', 'Atlas', 'Canyon', 'Sterling']
  }
};
