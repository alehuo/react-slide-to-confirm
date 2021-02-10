import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { linearSlider, Slider, SliderProps } from "../slider";

export default {
  title: "Slider",
  component: Slider,
} as Meta;

const Template: Story<SliderProps> = (args) => <Slider {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: "Slider",
  initialX: 0,
  initialY: 0,
  fn: linearSlider,
  maxX: 200,
  onConfirm: () => alert("Confirmed!"),
};
