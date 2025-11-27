import 'package:evoting_flutter/pages/register.dart';
import 'package:evoting_flutter/stacks/app_stack.dart';
import 'package:evoting_flutter/stacks/auth_stacks.dart';
import 'package:flutter/material.dart';
import './pages/login.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  bool isAuthenticate = false;

  void login() {
    setState(() {
      isAuthenticate = true;
    });
  }

  void logout() {
    setState(() {
      isAuthenticate = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-Voting',
      home: isAuthenticate ? AppStack() : AuthStack(onLogin: login),
    );
  }
}
