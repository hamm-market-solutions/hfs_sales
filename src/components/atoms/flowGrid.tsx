import clsx from "clsx";

export function FlowGrid({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={clsx(
                "grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
                className,
            )}
        >
            {children}
        </div>
    );
}