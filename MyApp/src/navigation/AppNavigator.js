import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ── Screens ──
import Login          from '../screens/Login';
import Register       from '../screens/Register.js';
import Home           from '../screens/Home';
import Dashboard      from '../screens/Dashboard';
import MyCourses      from '../screens/MyCourses';
import CourseDetail   from '../screens/CourseDetail';
import Categories     from '../screens/Categories';
import CourseCatalog  from '../screens/CourseCatalog';
import Certifications from '../screens/Certifications';
import Notifications  from '../screens/Notifications';
import Profile        from '../screens/Profile';
import FAQ            from '../screens/FAQ';
import About          from '../screens/About';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth */}
        <Stack.Screen name="Login"    component={Login}    />
        <Stack.Screen name="Register" component={Register} />

        {/* Main */}
        <Stack.Screen name="Home"          component={Home}          />
        <Stack.Screen name="Dashboard"     component={Dashboard}     />

        {/* Courses */}
        <Stack.Screen name="MyCourses"     component={MyCourses}     />
        <Stack.Screen name="CourseDetail"  component={CourseDetail}  />
        <Stack.Screen name="Categories"    component={Categories}    />
        <Stack.Screen name="CourseCatalog" component={CourseCatalog} />

        {/* Learner */}
        <Stack.Screen name="Certifications" component={Certifications} />
        <Stack.Screen name="Notifications"  component={Notifications}  />
        <Stack.Screen name="Profile"        component={Profile}        />

        {/* Info */}
        <Stack.Screen name="FAQ"   component={FAQ}   />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}