import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const { transactions, loadData, isLoading, summary, deleteTransaction } = useTransactions(user.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if(isLoading) return <PageLoader />;

  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* LEFT SIDE */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            <View>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0].emailAddress.split("@")[0]}
              </Text>

            </View>


          </View>

          {/* RIGHT SIDE */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF"/>
              <Text>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>

        </View>
      </View>
    </View>
  );
}
