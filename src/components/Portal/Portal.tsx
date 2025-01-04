import React from 'react';
import ReactDOM from 'react-dom/client';

interface Props {
    children: React.ReactNode;
    node?: HTMLElement;
}

export class Portal extends React.Component<Props> {
    private defaultNode: HTMLElement | null = null;
    private root: ReactDOM.Root | null = null;

    componentDidMount() {
        this.renderPortal();
    }

    componentDidUpdate() {
        this.renderPortal();
    }

    componentWillUnmount() {
        if (this.defaultNode) {
            document.body.removeChild(this.defaultNode);
        }
        this.defaultNode = null;
        this.root?.unmount();
    }

    renderPortal() {
        if (!this.props.node && !this.defaultNode) {
            this.defaultNode = document.createElement('div');
            document.body.appendChild(this.defaultNode);
        }

        const node = this.props.node || this.defaultNode;
        if (!node) return;

        if (!this.root) {
            this.root = ReactDOM.createRoot(node);
        }
        this.root.render(this.props.children);
    }

    render() {
        return null;
    }
}
