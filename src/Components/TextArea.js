import React, { Component } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { eclipse } from '@uiw/codemirror-theme-eclipse';

class TextArea extends Component {
	render() {
		return (
			<div>
				<CodeMirror
					value={this.props.text}
					theme={eclipse}
					extensions={[javascript()]}
					onChange={this.props.setText}
				/>
			</div>
		);
	}
}

export default TextArea;