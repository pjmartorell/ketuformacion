import styled from 'styled-components';

export const ItemContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform ${({ theme }) => theme.transitions.fast};

    &:hover {
        transform: scale(1.05);
    }
`;

export const NameLabel = styled.div`
    position: absolute;
    top: -25px;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 12px;
    white-space: nowrap;
`;
