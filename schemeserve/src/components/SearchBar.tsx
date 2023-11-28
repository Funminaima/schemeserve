import React from "react";
import { Select, Space, Tag, Row, Col, Input, AutoComplete } from "antd";
import { CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";

import { Crime } from "../type.d";

const { Option } = AutoComplete;
interface SearchBarProps {
  handleSearch: (value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  postCode: string;
  handlePostCodeClick: (
    selectedPostcode: string,
    crimeDataPerPostCode: Crime
  ) => void;
  handleRemovePostCode: (postcode: string) => void;
  historicPostCode: [];
  crimeDataPerPostCode: any;
}

const SearchBar = ({
  handleSearch,
  handleChange,
  postCode,
  historicPostCode,
  handlePostCodeClick,
  handleRemovePostCode,
  crimeDataPerPostCode,
}: SearchBarProps) => {
  const renderTitle = (title: string) => (
    <div className="display-flex">
      {title}
      <Tag
        icon={<EyeOutlined />}
        color="blue"
        onClick={() => handlePostCodeClick(title, crimeDataPerPostCode)}
        style={{ cursor: "pointer" }}
      >
        View
      </Tag>
      <Tag
        icon={<EyeOutlined />}
        color="blue"
        onClick={() => handleRemovePostCode(title)}
        style={{ cursor: "pointer" }}
      >
        Remove
      </Tag>
    </div>
  );

  const options = historicPostCode.map((search: any) => ({
    label: renderTitle(search),
  }));

  return (
    <div className="SearchBar">
      <Row>
        <Col span={12}>
          <AutoComplete
            style={{ width: "100%" }}
            popupMatchSelectWidth={500}
            options={options}
          >
            <Input.Search
              size="large"
              onChange={handleChange}
              onSearch={handleSearch}
              value={postCode}
              enterButton
            />
          </AutoComplete>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;
