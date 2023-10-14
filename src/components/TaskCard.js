import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import Task from "./Task";
import Ionicons from "react-native-vector-icons/Ionicons";
import ThemeContext from "../store/darkMode/theme-context";
import { FontAwesome } from "@expo/vector-icons";

export default function TaskCard({
  items,
  addItem,
  editItem,
  deleteItem,
  task,
  setTask,
  isAddModalVisible,
  setIsAddModalVisible,
  isEditModalVisible,
  setIsEditModalVisible,
}) {
  const { themeIs } = useContext(ThemeContext);
  const [editIndex, setEditIndex] = useState("");

  return (
    <View
      className={`${
        themeIs === "light" ? "bg-tertiaryColor" : "bg-darkTertiary"
      } rounded-t-[40] py-8 px-5 mt-4 w-full flex`}
    >
      <View className="rounded-xl pb-2">
        <View className="flex-row items-center justify-between px-3 pb-3">
          <Text
            Text
            className={`${
              themeIs === "light" ? "text-primaryColor" : "text-whiteColor"
            } font-normal text-lg tracking-widest uppercase`}
          >
            Tasks
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsAddModalVisible(!isAddModalVisible);
            }}
            style={{
              backgroundColor: themeIs === "light" ? "#2B6673" : "#2b6673",
              borderRadius: 999,
              padding: 8,
              borderWidth: 1,
              borderColor: themeIs === "light" ? "#2B6673" : "#aaedfc",
              shadowColor: "#141414",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="add-outline" size={20} color="#F5F5FA" />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={isAddModalVisible}
          onRequestClose={() => {
            setIsAddModalVisible(!isAddModalVisible);
          }}
        >
          <View className="flex-1 justify-center items-center">
            <View className="w-11/12 bg-primaryColor rounded-3xl py-8 items-center">
              <Pressable
                className="w-[80%] items-end"
                onPress={() => {
                  setIsAddModalVisible(!isAddModalVisible);
                  setTask("");
                }}
              >
                <FontAwesome name="close" size={32} color="red" />
              </Pressable>

              <Text className="text-2xl font-bold text-white">Add Task</Text>

              <TextInput
                onChangeText={setTask}
                value={task}
                className="pl-1 w-[80%] bg-whiteColor rounded-lg h-[40] my-[10] text-lg"
              />
              <Pressable
                className="w-[80%] my-2 bg-secondaryColor text-white h-[40] rounded-lg justify-center items-center"
                onPress={() => {
                  addItem({ task: task });
                }}
              >
                <Text className="text-lg">Add Task</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => {
            setIsEditModalVisible(!isEditModalVisible);
          }}
        >
          <View className="flex-1 justify-center items-center">
            <View className="w-11/12 bg-primaryColor rounded-3xl py-8 items-center">
              <Pressable
                className="w-[80%] items-end"
                onPress={() => {
                  setIsEditModalVisible(!isEditModalVisible);
                  setTask("");
                }}
              >
                <FontAwesome name="close" size={32} color="red" />
              </Pressable>

              <Text className="text-2xl font-bold text-white">Edit Task</Text>

              <TextInput
                onChangeText={setTask}
                value={task}
                className="pl-1 w-[80%] bg-whiteColor rounded-lg h-[40] my-[10] text-lg"
              />
              <Pressable
                className="w-[80%] my-2 bg-secondaryColor text-white h-[40] rounded-lg justify-center items-center"
                onPress={() => {
                  editItem(editIndex, { task: task });
                }}
              >
                <Text className="text-lg">Edit Task</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View>
          <View className="my-2">
            {items.map((item, index) => (
              <Task
                key={index}
                index={index}
                task={item.task}
                setTask={setTask}
                deleteItem={deleteItem}
                isEditModalVisible={isEditModalVisible}
                setIsEditModalVisible={setIsEditModalVisible}
                setEditIndex={setEditIndex}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
