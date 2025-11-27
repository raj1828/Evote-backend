import 'package:evoting_flutter/pages/login.dart';
import 'package:evoting_flutter/pages/register.dart';
import 'package:flutter/material.dart';

// Accept onLogin as a parameter
class AuthStack extends StatelessWidget {
  final void Function() onLogin; // <-- Add this parameter

  const AuthStack(
      {super.key,
      required this.onLogin}); // <-- Pass it through the constructor

  @override
  Widget build(BuildContext context) {
    return Navigator(
      initialRoute: '/login',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/register':
            return MaterialPageRoute(builder: (_) => const Register());

          case '/login':
          default:
            return MaterialPageRoute(
              builder: (_) =>
                  Login(onLogin: onLogin), // <-- Pass onLogin to Login
            );
        }
      },
    );
  }
}
