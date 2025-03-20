import React from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from "react-native";

interface MinimizedBubbleNativeProps {
  isActive: boolean;
  onExpand: () => void;
}

class MinimizedBubbleNative extends React.Component<MinimizedBubbleNativeProps> {
  private pan: Animated.ValueXY;
  private panResponder: any;
  private screenWidth: number;
  private screenHeight: number;

  constructor(props: MinimizedBubbleNativeProps) {
    super(props);

    this.pan = new Animated.ValueXY({ x: 20, y: 100 });
    this.screenWidth = Dimensions.get("window").width;
    this.screenHeight = Dimensions.get("window").height;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: this.pan.x, dy: this.pan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (e, gesture) => {
        // Keep bubble within screen bounds
        let newX = gesture.moveX - 30; // Adjust based on touch position
        let newY = gesture.moveY - 30; // Adjust based on touch position

        // Boundary checks
        if (newX < 0) newX = 0;
        if (newX > this.screenWidth - 60) newX = this.screenWidth - 60;
        if (newY < 0) newY = 0;
        if (newY > this.screenHeight - 60) newY = this.screenHeight - 60;

        // Snap to edges
        if (newX < 50) newX = 0;
        if (newX > this.screenWidth - 110) newX = this.screenWidth - 60;

        Animated.spring(this.pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
        }).start();
      },
    });
  }

  render() {
    const { isActive, onExpand } = this.props;

    return (
      <Animated.View
        style={[
          styles.bubble,
          isActive ? styles.activeBubble : styles.inactiveBubble,
          {
            transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }],
          },
        ]}
        {...this.panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.touchArea}
          onPress={onExpand}
          activeOpacity={0.8}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeBubble: {
    backgroundColor: "#3b82f6",
  },
  inactiveBubble: {
    backgroundColor: "#9ca3af",
  },
  touchArea: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
});

export default MinimizedBubbleNative;
