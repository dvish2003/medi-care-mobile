import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@/types/user";
import { registerUser } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Animated Medical Cross Logo Component
const AnimatedMedicalCrossIcon = ({ size = 80, color = "#fff" }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
        },
      ]}
    >
      <LinearGradient
        colors={["#034c36", "#003333", "#BDCDCF"]}
        style={styles.gradientCircle}
      >
        <View style={[styles.crossLine, { 
          backgroundColor: color, 
          width: size * 0.5, 
          height: size * 0.12,
        }]} />
        <View style={[styles.crossLine, { 
          backgroundColor: color, 
          width: size * 0.12, 
          height: size * 0.5,
        }]} />
      </LinearGradient>
    </Animated.View>
  );
};

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState<boolean>(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      shakeAnimation();
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      shakeAnimation();
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      shakeAnimation();
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await registerUser({ email, password } as User);

      if (response) {
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          Alert.alert("Success", "Registration successful!");
          router.push("/login");
          setIsLoading(false);
        }, 1500);
      } else {
        shakeAnimation();
        Alert.alert("Error", "Registration failed");
        setIsLoading(false);
      }
    } catch (error) {
      shakeAnimation();
      Alert.alert("Error", "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  const shakeAnimation = () => {
    const shake = new Animated.Value(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient
      colors={["#BDCDCF", "#034c36", "#003333"]}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            {/* Logo/Header Section */}
            <View style={styles.logoSection}>
              <AnimatedMedicalCrossIcon size={100} color="#fff" />
              <Text style={styles.appName}>Medi-Care</Text>
              <Text style={styles.tagline}>Your Health, Our Priority</Text>
            </View>

            {/* Registration Form */}
            <Animated.View style={styles.formContainer}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.instructionText}>
                Sign up to get started with Medi-Care
              </Text>

              <Animated.View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#034c36" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#7A8D8F"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Animated.View>

              <Animated.View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#034c36" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#7A8D8F"
                  style={styles.input}
                  secureTextEntry={secureTextEntry}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable 
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#034c36" 
                  />
                </Pressable>
              </Animated.View>

              <Animated.View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#034c36" style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#7A8D8F"
                  style={styles.input}
                  secureTextEntry={confirmSecureTextEntry}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Pressable 
                  onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={confirmSecureTextEntry ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#034c36" 
                  />
                </Pressable>
              </Animated.View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By registering, you agree to our{" "}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>

              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={0.9}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={["#034c36", "#003333", "#034c36"]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={styles.registerButtonText}>Create Account</Text>
                        <Ionicons name="person-add" size={20} color="#fff" />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable 
                style={styles.loginContainer}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.loginText}>
                  Already have an account?{" "}
                  <Text style={styles.loginLink}>Login Now</Text>
                </Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    padding: 10,
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginBottom: 30,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  crossLine: {
    position: 'absolute',
    borderRadius: 5,
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginTop: 20,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 8,
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(189, 205, 207, 0.3)",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#034c36",
    textAlign: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 15,
    color: "#5A6D6F",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(189, 205, 207, 0.2)",
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(3, 76, 54, 0.2)",
    shadowColor: "#034c36",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#003333",
    fontSize: 16,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 5,
  },
  termsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    color: "#5A6D6F",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  termsLink: {
    color: "#034c36",
    fontWeight: "600",
  },
  registerButton: {
    height: 60,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#034c36",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    letterSpacing: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(3, 76, 54, 0.3)",
  },
  dividerText: {
    color: "#034c36",
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "600",
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    color: "#5A6D6F",
    fontSize: 16,
  },
  loginLink: {
    color: "#034c36",
    fontWeight: "700",
  },
});

export default Register;