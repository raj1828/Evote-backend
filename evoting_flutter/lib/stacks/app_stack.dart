import 'package:evoting_flutter/pages/dashboard.dart';
import 'package:flutter/material.dart';

class AppStack extends StatelessWidget {
  const AppStack({super.key});

  @override
  Widget build(BuildContext context) {
    return Navigator(
      onGenerateRoute: (settings) {
        return MaterialPageRoute(builder: (_) => const Dashboard());
      },
    );
  }
}
